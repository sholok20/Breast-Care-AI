import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image,
  X,
  FileImage,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import API from "../../services/api";

interface UploadPageProps {
  onImageUpload: (imageUrl: string) => void;
}

export function UploadPage({ onImageUpload }: UploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [examId, setExamId] = useState("1");
  const [viewPosition, setViewPosition] = useState("CC");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    const role = localStorage.getItem("role");

    if (role === "hospital") {
      navigate("/hospital-dashboard");
    } else {
      navigate("/patient-dashboard");
    }
  };

  const handleFileSelect = (file: File) => {
    if (
      file &&
      (file.type.startsWith("image/") ||
        file.name.toLowerCase().endsWith(".dcm"))
    ) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      alert("Please select JPG, PNG, JPEG, or DICOM file.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a mammogram image first.");
      return;
    }

    if (!examId) {
      alert("Please enter Exam ID.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await API.post(
        `/uploads/mammogram/${examId}?view_position=${viewPosition}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", response.data);

      localStorage.setItem("latest_ai_result", JSON.stringify(response.data));

      if (previewUrl) {
        onImageUpload(previewUrl);
      }

      alert("Mammogram uploaded and analyzed successfully.");
      navigate("/report");
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error);
      alert(error?.response?.data?.detail || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-8">
        <FileImage className="w-16 h-16 text-pink-600 mx-auto mb-4" />

        <h1 className="text-pink-600 mb-2">Upload Mammogram Image</h1>

        <p className="text-gray-600">
          Upload a mammogram image for AI-powered analysis
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

        <div className="text-blue-800">
          <p className="mb-2">
            <strong>Important:</strong> This is a prototype demonstration.
          </p>

          <ul className="space-y-1 ml-4">
            <li>• Images are sent to the FastAPI backend</li>
            <li>• Image path is saved in PostgreSQL</li>
            <li>• AI analysis result is saved as an AI report</li>
            <li>• Embedding is generated for similarity search</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 className="text-pink-600 mb-4">Exam Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Exam ID</label>

            <input
              type="number"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Example: 1"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">View Position</label>

            <select
              value={viewPosition}
              onChange={(e) => setViewPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="CC">CC</option>
              <option value="MLO">MLO</option>
              <option value="LM">LM</option>
              <option value="ML">ML</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-pink-600 bg-pink-50"
                : "border-gray-300 hover:border-pink-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.dcm,image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-gray-700 mb-2">
              Drop your mammogram image here
            </h3>

            <p className="text-gray-500 mb-4">or</p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Browse Files
            </button>

            <p className="text-gray-400 mt-4">
              Supported formats: JPG, PNG, JPEG, DICOM
            </p>
          </div>
        ) : (
          <div>
            <div className="relative">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Mammogram preview"
                    className="max-w-full max-h-96 mx-auto rounded"
                  />
                ) : (
                  <div className="text-center text-gray-600 py-12">
                    DICOM file selected. Preview is not available.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <Image className="w-5 h-5 text-pink-600" />

              <div className="flex-1">
                <p className="text-gray-700">{selectedFile.name}</p>

                <p className="text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUploadAndAnalyze}
              disabled={isUploading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <Upload className="w-5 h-5" />

              {isUploading ? "Uploading and analyzing..." : "Analyze Image"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-pink-600 mb-4">Image Upload Guidelines</h3>

        <div className="space-y-2 text-gray-700">
          <p>• Make sure the exam ID exists in the database first</p>
          <p>• Standard mammogram views include MLO and CC projections</p>
          <p>• High-resolution images provide better analysis results</p>
          <p>• Images should be in DICOM, JPG, JPEG, or PNG format</p>
        </div>
      </div>
    </div>
  );
}