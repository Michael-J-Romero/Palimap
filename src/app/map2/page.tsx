import dynamic from "next/dynamic";

const SplitMap = dynamic(() => import("../../components/interactiveMap/index.js"), { ssr: false });

export default function Home() {
  return <SplitMap />;
}
