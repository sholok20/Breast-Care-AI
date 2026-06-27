import logo from 'figma:asset/4053fc427b421a3bb9341738f7fdefeeef603408.png';

export function BreastCancerLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <img 
      src={logo} 
      alt="Breast Cancer Foundation of Egypt" 
      className={className}
    />
  );
}