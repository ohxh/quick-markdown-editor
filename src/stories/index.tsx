import * as React from "react";
import { dark, light } from "../styles/theme";
import Editor from "..";
import Excalidraw from "@excalidraw/excalidraw";
import initialData from "./initialData";
import "./style.css";
const docSearchResults = [
  {
    title: "Hiring",
    subtitle: "Created by Jane",
    url: "/doc/hiring",
  },
  {
    title: "Product Roadmap",
    subtitle: "Created by Tom",
    url: "/doc/product-roadmap",
  },
  {
    title: "Finances",
    subtitle: "Created by Coley",
    url: "/doc/finances",
  },
  {
    title: "Security",
    subtitle: "Created by Coley",
    url: "/doc/security",
  },
  {
    title: "Super secret stuff",
    subtitle: "Created by Coley",
    url: "/doc/secret-stuff",
  },
  {
    title: "Supero notes",
    subtitle: "Created by Vanessa",
    url: "/doc/supero-notes",
  },
  {
    title: "Meeting notes",
    subtitle: "Created by Rob",
    url: "/doc/meeting-notes",
  },
];

class YoutubeEmbed extends React.Component<{
  attrs: any;
  isSelected: boolean;
}> {
  render() {
    const { attrs } = this.props;
    const videoId = attrs.matches[1];

    return (
      <iframe
        className={this.props.isSelected ? "ProseMirror-selectednode" : ""}
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
      />
    );
  }
}

const ExcalidrawEmbed = () => {
  const excalidrawRef = React.useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(true);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: [],
        },
      ],
      appState: {
        viewBackgroundColor: "transparent",
      },
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  return (
    <div className="App">
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={initialData}
          onChange={(elements, state) =>
            console.log("Elements :", elements, "State : ", state)
          }
          onPointerUpdate={payload => console.log(payload)}
          onCollabButtonClick={() =>
            window.alert("You clicked on collab button")
          }
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
        />
      </div>
    </div>
  );
};

const embeds = [
  {
    title: "Drawing",
    keywords: "excalidraw drawing sketch diagram",
    defaulHidden: false,
    icon: () => (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
        width={24}
        height={24}
      />
    ),
    matcher: url => {
      return url.match(/a/);
    },
    component: ExcalidrawEmbed,
  },
  {
    title: "YouTube",
    keywords: "youtube video tube google",
    defaultHidden: true,
    // eslint-disable-next-line react/display-name
    icon: () => (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
        width={24}
        height={24}
      />
    ),
    matcher: url => {
      return url.match(
        /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
      );
    },
    component: YoutubeEmbed,
  },
];

export default function Example(props) {
  const { body } = document;
  if (body)
    body.style.backgroundColor = props.dark
      ? dark.background
      : light.background;

  return (
    <div style={{ padding: "1em 2em" }}>
      <Editor
        onCreateLink={title => {
          // Delay to simulate time taken for remote API request to complete
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (title !== "error") {
                return resolve(
                  `/doc/${encodeURIComponent(title.toLowerCase())}`
                );
              } else {
                reject("500 error");
              }
            }, 1500);
          });
        }}
        onSearchLink={async term => {
          console.log("Searched link: ", term);

          // Delay to simulate time taken for remote API request to complete
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(
                docSearchResults.filter(result =>
                  result.title.toLowerCase().includes(term.toLowerCase())
                )
              );
            }, Math.random() * 500);
          });
        }}
        uploadImage={file => {
          console.log("File upload triggered: ", file);

          // Delay to simulate time taken to upload
          return new Promise(resolve => {
            setTimeout(() => resolve(URL.createObjectURL(file)), 1500);
          });
        }}
        embeds={embeds}
        {...props}
      />
    </div>
  );
}
