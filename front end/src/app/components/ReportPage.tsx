import { useEffect, useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Calendar,
  User,
  Save,
} from "lucide-react";
import API from "../../services/api";

interface ReportPageProps {
  imageUrl: string;
  userType: "patient" | "hospital" | "admin" | null;
}

export function ReportPage({ imageUrl, userType }: ReportPageProps) {
  const [reportData, setReportData] = useState<any>(null);
  const [similarImages, setSimilarImages] = useState<any[]>([]);

  const [doctorName, setDoctorName] = useState("");
  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [doctorReport, setDoctorReport] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const toPercent = (value: any) => {
    const num = Number(value || 0);
    return num <= 1 ? num * 100 : num;
  };

  const getProbabilityColor = (className: string) => {
    if (className === "malignant") return "bg-red-600";
    if (className === "benign") return "bg-yellow-500";
    return "bg-green-600";
  };

  const getDiagnosisColor = (label: string) => {
    if (label === "malignant") return "text-red-600";
    if (label === "benign") return "text-yellow-600";
    return "text-green-600";
  };

  const getDiagnosisBackground = (label: string) => {
    if (label === "malignant") return "bg-red-100";
    if (label === "benign") return "bg-yellow-100";
    return "bg-green-100";
  };

  const formatDiagnosis = (label: string) => {
    if (label === "malignant") return "Malignant";
    if (label === "benign") return "Benign";
    return "Normal";
  };

  useEffect(() => {
    const savedResult = localStorage.getItem("latest_ai_result");

    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      setReportData(parsed);

      const savedAiReport = parsed.ai_report;

      setDoctorName(savedAiReport?.doctor_name || "");
      setFinalDiagnosis(savedAiReport?.final_diagnosis || "");
      setDoctorReport(savedAiReport?.doctor_report || "");
      setRecommendation(savedAiReport?.recommendation || "");

      const imageId = parsed?.image?.image_id;

      if (imageId) {
        API.get(`/similarity/similar/${imageId}?limit=5`)
          .then((response) => {
            setSimilarImages(response.data.top_matches || []);
          })
          .catch((error) => {
            console.error("Similarity search error:", error);
          });
      }
    }
  }, []);

  if (!reportData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-red-600 text-2xl">No AI report found</h2>
      </div>
    );
  }

  const aiReport = reportData.ai_report;
  const image = reportData.image;

  const reportId = aiReport?.report_id || aiReport?.id;

  const classification =
    reportData?.ai_details?.classification ||
    reportData?.details?.classification ||
    {};

  const detectionBoxes =
    reportData?.ai_details?.detection?.boxes ||
    reportData?.details?.detection?.boxes ||
    [];

  const hasMalignantDetection = detectionBoxes.some(
    (box: any) => String(box.label).toLowerCase() === "malignant"
  );

  const finalLabel =
    classification?.final_label ||
    classification?.label ||
    (hasMalignantDetection ? "malignant" : "normal");

  const classifierLabel =
    classification?.classifier_label ||
    classification?.label ||
    "unknown";

  const classifierProbability = classification?.classifier_probability || 0;

  const classProbabilities = classification?.class_probabilities || {
    benign: 0,
    malignant: 0,
    normal: 0,
  };

  const confidenceScore = toPercent(
    aiReport?.confidence_score ?? classification?.confidence_score
  );

  const inferenceTime =
    aiReport?.inference_time_ms ??
    reportData?.inference_time_ms ??
    reportData?.ai_details?.inference_time_ms ??
    reportData?.details?.inference_time_ms ??
    "N/A";

  const annotatedImageUrl =
    reportData?.ai_details?.detection?.annotated_image_url
      ? reportData.ai_details.detection.annotated_image_url
      : reportData?.details?.detection?.annotated_image_url
      ? reportData.details.detection.annotated_image_url
      : aiReport?.annotated_image_path
      ? `http://127.0.0.1:8000/uploaded-files/annotated/${aiReport.annotated_image_path
          .split("/")
          .pop()}`
      : imageUrl;

  const handleSaveDoctorReport = async () => {
    if (!reportId) {
      alert("Report ID not found");
      return;
    }

    try {
      const response = await API.put(`/ai-reports/${reportId}/doctor-review`, {
        doctor_name: doctorName,
        final_diagnosis: finalDiagnosis,
        doctor_report: doctorReport,
        recommendation: recommendation,
      });

      const updatedReport = response.data;

      const updatedLocalResult = {
        ...reportData,
        ai_report: {
          ...aiReport,
          doctor_name: updatedReport.doctor_name,
          final_diagnosis: updatedReport.final_diagnosis,
          doctor_report: updatedReport.doctor_report,
          recommendation: updatedReport.recommendation,
          reviewed_at: updatedReport.reviewed_at,
        },
      };

      setReportData(updatedLocalResult);
      localStorage.setItem(
        "latest_ai_result",
        JSON.stringify(updatedLocalResult)
      );

      alert("Doctor report saved successfully");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to save doctor report");
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:max-w-none print:px-0 print:py-0">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none print:border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-pink-600" />

            <div>
              <h1 className="text-pink-600 text-3xl">AI Analysis Report</h1>
              <p className="text-gray-500">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h2 className="text-pink-600 text-2xl mb-4">Overall Assessment</h2>

            <div className="grid grid-cols-3 gap-4">
              <div
                className={`rounded-lg p-4 text-center ${getDiagnosisBackground(
                  finalLabel
                )}`}
              >
                <p className="text-gray-600 mb-1">Detection</p>

                <p
                  className={`text-2xl font-bold ${getDiagnosisColor(
                    finalLabel
                  )}`}
                >
                  {formatDiagnosis(finalLabel)}
                </p>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-1">YOLO Confidence Score</p>

                <p className="text-2xl font-bold text-blue-600">
                  {Number.isFinite(confidenceScore)
                    ? Math.round(confidenceScore)
                    : 0}
                  %
                </p>
              </div>

              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-1">Report ID</p>

                <p className="text-2xl font-bold text-purple-600">
                  {reportId}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h2 className="text-pink-600 text-2xl mb-4">
              Class Probabilities
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <p className="text-gray-600">Classifier Prediction</p>

              <p
                className={`text-2xl font-bold capitalize ${getDiagnosisColor(
                  classifierLabel
                )}`}
              >
                {classifierLabel}
              </p>

              <p className="text-gray-500">
                Probability: {toPercent(classifierProbability).toFixed(1)}%
              </p>
            </div>

            <div className="space-y-4">
              {["benign", "malignant", "normal"].map((className) => {
                const percent = toPercent(classProbabilities[className]);

                return (
                  <div key={className}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize font-medium text-gray-700">
                        {className}
                      </span>

                      <span className="font-semibold">
                        {percent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${getProbabilityColor(
                          className
                        )} h-4 rounded-full transition-all`}
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h2 className="text-pink-600 text-2xl mb-4">AI Findings</h2>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    finalLabel === "malignant" ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {finalLabel === "malignant" ? (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl text-gray-800 mb-2">
                    Mammogram Analysis
                  </h3>

                  <p className="text-gray-700 text-lg">{aiReport.findings}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h2 className="text-pink-600 text-2xl mb-4">
              Doctor Review / Final Medical Report
            </h2>

            {userType === "hospital" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Doctor Name
                    </label>

                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Dr. Ahmed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Final Diagnosis
                    </label>

                    <input
                      type="text"
                      value={finalDiagnosis}
                      onChange={(e) => setFinalDiagnosis(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Benign / Malignant / Needs follow-up"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Doctor Report
                  </label>

                  <textarea
                    value={doctorReport}
                    onChange={(e) => setDoctorReport(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg min-h-32"
                    placeholder="Write the doctor's medical interpretation here..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Recommendation
                  </label>

                  <textarea
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg min-h-24"
                    placeholder="Recommended action, follow-up, biopsy, ultrasound, etc."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveDoctorReport}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 flex items-center gap-2 print:hidden"
                >
                  <Save className="w-4 h-4" />
                  Save Doctor Report
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>Doctor:</strong> {doctorName || "Not reviewed yet"}
                </p>

                <p>
                  <strong>Final Diagnosis:</strong>{" "}
                  {finalDiagnosis || "Not reviewed yet"}
                </p>

                <p>
                  <strong>Doctor Report:</strong>{" "}
                  {doctorReport || "Not reviewed yet"}
                </p>

                <p>
                  <strong>Recommendation:</strong>{" "}
                  {recommendation || "Not reviewed yet"}
                </p>
              </div>
            )}
          </div>

          {detectionBoxes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
              <h2 className="text-pink-600 text-2xl mb-4">
                Detected Regions
              </h2>

              <div className="space-y-3">
                {detectionBoxes.map((box: any, index: number) => {
                  const boxConfidence = toPercent(
                    box.confidence_score ?? box.confidence
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <p className="font-bold text-gray-800 mb-2">
                        Detection #{index + 1}
                      </p>

                      <p>
                        <strong>YOLO Diagnosis:</strong> {box.label}
                      </p>

                      <p>
                        <strong>YOLO Confidence Score:</strong>{" "}
                        {boxConfidence.toFixed(1)}%
                      </p>

                      <p className="mt-2 font-semibold">Bounding Box</p>

                      <p>
                        <strong>X1:</strong> {Math.round(box.x1)}
                        {" | "}
                        <strong>Y1:</strong> {Math.round(box.y1)}
                      </p>

                      <p>
                        <strong>X2:</strong> {Math.round(box.x2)}
                        {" | "}
                        <strong>Y2:</strong> {Math.round(box.y2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
            <h2 className="text-pink-600 text-2xl mb-4">
              Top 5 Similar Mammograms
            </h2>

            {similarImages.length === 0 ? (
              <p className="text-gray-500">No similar mammograms found yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarImages.map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={`Similar mammogram ${index + 1}`}
                        className="w-full h-48 object-contain rounded border bg-black mb-3"
                      />
                    )}

                    <p>
                      <strong>Rank:</strong> #{index + 1}
                    </p>

                    <p>
                      <strong>Image ID:</strong> {item.image_id}
                    </p>

                    <p>
                      <strong>Exam ID:</strong> {item.exam_id}
                    </p>

                    <p>
                      <strong>Similarity:</strong>{" "}
                      {(item.similarity_score * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h2 className="text-pink-600 text-2xl mb-4">
              Technical Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Image ID</p>
                <p className="text-xl font-bold">{image?.image_id}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">View Position</p>
                <p className="text-xl font-bold">{image?.view_position}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Image Type</p>
                <p className="text-xl font-bold">{image?.image_type}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Embedding Saved</p>

                <p className="text-xl font-bold text-green-600">
                  {reportData.embedding_saved ? "YES" : "NO"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Inference Time</p>

                <p className="text-xl font-bold text-blue-600">
                  {inferenceTime} ms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 print:block">
          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h3 className="text-pink-600 text-xl mb-4">
              YOLO Detection Result
            </h3>

            <img
              src={annotatedImageUrl}
              alt="YOLO Detection"
              className="w-full rounded-lg border"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:border print:mb-4">
            <h3 className="text-pink-600 text-xl mb-4">Session Details</h3>

            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{userType}</span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span>BreastCare AI v2.1</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 print:border print:mb-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />

              <div className="text-yellow-800">
                <p className="font-bold mb-2">Important Disclaimer</p>

                <p>
                  This AI analysis is a prototype demonstration and must be
                  reviewed by a qualified radiologist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            nav {
              display: none !important;
            }

            body {
              background: white !important;
            }

            input,
            textarea {
              border: none !important;
              resize: none !important;
            }

            button {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}