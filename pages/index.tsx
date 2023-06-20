import Head from "@/components/Head";
import Main from "@/components/Main";
import ConfigDialog from "@/components/dialogs/ConfigDialog";
import InitDialog from "@/components/dialogs/InitDialog";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton } from "@mui/material";
import dynamic from "next/dynamic";

const style = {
  githubIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
};

export const ForceGraph = dynamic(() => import("@/components/graphs/ForceGraph"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head />
      <Main>
        <ForceGraph />

        <IconButton href="https://github.com/rl404/sekai" target="_blank" sx={style.githubIcon}>
          <GitHubIcon />
        </IconButton>

        <InitDialog />

        <ConfigDialog />
      </Main>
    </>
  );
}
