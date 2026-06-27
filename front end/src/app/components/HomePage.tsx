import { Heart, AlertCircle, CheckCircle, Hand } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BreastCancerLogo } from './BreastCancerLogo';

export function HomePage() {
  const selfExamSteps = [
    {
      title: "In the Shower",
      description: "With your fingers flat, move gently over every part of each breast. Use your right hand to examine the left breast, left hand for right breast. Check for any lump, thickening, or hardened knot.",
      position: "Standing"
    },
    {
      title: "In Front of a Mirror",
      description: "Visually inspect your breasts with arms at your sides, then raised overhead. Look for any changes in contour, swelling, dimpling of skin, or changes in the nipples.",
      position: "Standing"
    },
    {
      title: "Lying Down",
      description: "Place a pillow under your right shoulder and put your right arm behind your head. Using your left hand, move the pads of your fingers around your right breast gently in small circular motions. Repeat on the other side.",
      position: "Lying down"
    }
  ];

  const awarenessStats = [
    { stat: "1 in 8", description: "Women will develop breast cancer in their lifetime" },
    { stat: "99%", description: "Survival rate when detected early" },
    { stat: "Monthly", description: "Recommended self-examination frequency" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <BreastCancerLogo className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-pink-600 mb-4">Breast Cancer Awareness & Early Detection</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Early detection saves lives. Learn about breast cancer, perform regular self-examinations, 
          and use our AI-powered screening tool to get professional analysis of mammogram images.
        </p>
      </div>

      {/* Awareness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {awarenessStats.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-pink-600 mb-2">{item.stat}</div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Awareness Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-pink-600 mb-4">Why Awareness Matters</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Early detection significantly increases treatment success rates and survival</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Monthly self-examinations help you know what's normal for your body</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Regular mammograms can detect cancer before symptoms appear</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">Knowledge empowers you to take control of your health</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1600673645627-1c47394132ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhc3QlMjBjYW5jZXIlMjBhd2FyZW5lc3MlMjByaWJib258ZW58MXx8fHwxNzY0Nzk3MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Breast cancer awareness"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Self-Examination Guide */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Hand className="w-12 h-12 text-pink-600 mx-auto mb-4" />
          <h2 className="text-pink-600 mb-2">How to Perform a Self-Examination</h2>
          <p className="text-gray-600">Follow these three simple steps monthly to check for any changes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {selfExamSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-pink-600 text-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white text-pink-600 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h3 className="text-white">{step.title}</h3>
                </div>
                <p className="text-pink-100">{step.position}</p>
              </div>
              <div className="p-4">
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Guide */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden bg-white shadow-md">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1659353886114-9aa119aef5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc2VsZiUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NDc5NzAzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Self-examination guide"
                className="w-full h-64 object-cover"
              />
            </div>
            <div>
              <h3 className="text-pink-600 mb-4">What to Look For</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Any new lump or thickening in the breast or underarm</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Changes in breast size or shape</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Dimpling, puckering, or redness of the skin</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Nipple changes or unusual discharge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-white mb-4">Get AI-Powered Analysis</h2>
        <p className="max-w-2xl mx-auto">
          Our advanced AI system can help analyze mammogram images to detect potential abnormalities. 
          Use the navigation menu above to access the login portal.
        </p>
      </div>
    </div>
  );
}