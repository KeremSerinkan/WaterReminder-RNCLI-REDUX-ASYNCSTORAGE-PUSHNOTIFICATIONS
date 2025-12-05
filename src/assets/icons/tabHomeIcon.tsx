import Svg, { Path, SvgProps } from "react-native-svg";

export const TabBarHomeIcon = (props: SvgProps) => (
  <Svg
    width={24}       
    height={24}
    viewBox="0 0 512 512"
    {...props}
  >
    <Path
      d="M400,320c0,88.37-55.63,144-144,144S112,408.37,112,320c0-94.83,103.23-222.85,134.89-259.88a12,12,0,0,1,18.23,0C296.77,97.15,400,225.17,400,320Z"
      fill="none"
      stroke="#000"
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <Path
      d="M344,328a72,72,0,0,1-72,72"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
    />
  </Svg>
);
