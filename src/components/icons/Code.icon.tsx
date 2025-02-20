import { FC } from 'react';

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

export const CodeIcon: FC<SvgComponentProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-code-xml"
      {...props}
    >
      <path d="M18 16l4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
    </svg>
  );
};
