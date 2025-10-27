import { useTheme } from "next-themes";

const WaveBackground = () => {
    const {theme, setTheme} = useTheme();
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 400"
      xmlns="http://www.w3.org/2000/svg"
      className="transition duration-300 ease-in-out delay-150"
    >
      <path
        d="M 0,700 L 0,337 C 83.01794871794871,260.15 166.03589743589743,183.3 258,220 C 349.9641025641026,256.7 450.87435897435887,406.95 518,393 C 585.1256410256411,379.05 618.4666666666667,200.9 690,103 C 761.5333333333333,5.100000000000005 871.2589743589742,-12.549999999999997 972,10 C 1072.7410256410258,32.55 1164.497435897436,95.3 1241,94 C 1317.502564102564,92.7 1378.751282051282,27.35 1440,-38 L 1440,700 L 0,700 Z"
        stroke="none"
        strokeWidth="0"
        fill={`${theme === "dark" ? "#210F37" : "#E4EFE7"}`}
        fillOpacity="1"
        className="transition-all duration-300 ease-in-out delay-150 path-0"
      ></path>
    </svg>
  );
};

export default WaveBackground;
