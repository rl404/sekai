import * as React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { GraphData, GraphLink, GraphNode } from '../../types/Types';
import * as d3 from 'd3';

const inactiveColor = 'rgba(255,255,255,0.1)';
const activeColor = 'white';
const clickColor = 'red';

const ForceGraph = ({
  search,
  graphData,
  nodeColor,
  linkColor,
  showTitle,
  showExtendedRelation,
  showAnimeDrawer,
}: {
  search: string;
  graphData: GraphData | any;
  nodeColor: any;
  linkColor: any;
  showTitle: boolean;
  showExtendedRelation: boolean;
  showAnimeDrawer: (anime_id: number) => void;
}) => {
  const graphRef = React.useRef();

  const [hoverNode, setHoverNode] = React.useState<GraphNode | null>(null);
  const [hoverNodes, setHoverNodes] = React.useState(new Set());
  const [hoverLinks, setHoverLinks] = React.useState(new Set());

  const [clickNode, setClickNode] = React.useState<GraphNode | null>(null);
  const [clickNodes, setClickNodes] = React.useState(new Set());
  const [clickLinks, setClickLinks] = React.useState(new Set());

  const handleNodeHover = (node: GraphNode | any) => {
    hoverNodes.clear();
    hoverLinks.clear();

    if (node) {
      addRelatedHoverNodes(node);
    }

    setHoverNode(node || null);
  };

  const addRelatedHoverNodes = (node: GraphNode) => {
    hoverNodes.add(node);

    node.neighbors.forEach((neighbor: GraphNode) => {
      if (hoverNodes.has(neighbor)) return;
      hoverNodes.add(neighbor);
      showExtendedRelation && addRelatedHoverNodes(neighbor);
    });

    node.links.forEach((link: GraphLink) => {
      if (hoverLinks.has(link)) return;
      hoverLinks.add(link);
    });
  };

  const handleNodeClick = (node: GraphNode | any) => {
    showAnimeDrawer(node.anime_id);

    clickNodes.clear();
    clickLinks.clear();

    if (clickNode === node) {
      setClickNode(null);
    } else {
      setClickNode(node);
      addRelatedClickNodes(node);
    }
  };

  const addRelatedClickNodes = (node: GraphNode) => {
    clickNodes.add(node);

    node.neighbors.forEach((neighbor: GraphNode) => {
      if (clickNodes.has(neighbor)) return;
      clickNodes.add(neighbor);
      showExtendedRelation && addRelatedClickNodes(neighbor);
    });

    node.links.forEach((link: GraphLink) => {
      if (clickLinks.has(link)) return;
      clickLinks.add(link);
    });
  };

  const clearNodeClick = () => {
    setClickNode(null);
    clickNodes.clear();
    clickLinks.clear();
  };

  React.useEffect(() => {
    const gr: any = graphRef.current;
    gr.d3Force('collide', d3.forceCollide().radius(30));
  }, []);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      onBackgroundClick={clearNodeClick}
      nodeLabel=""
      nodeRelSize={10}
      nodeColor={(node: GraphNode | any) => {
        if (hoverNode) {
          if (hoverNodes.has(node)) {
            return nodeColor[node.user_anime_status];
          }
          return inactiveColor;
        }

        if (clickNode) {
          if (clickNodes.has(node)) {
            return nodeColor[node.user_anime_status];
          }
          return inactiveColor;
        }

        if (search !== '') {
          if (node.title.toLowerCase().includes(search)) {
            return nodeColor[node.user_anime_status];
          }
          return inactiveColor;
        }

        return nodeColor[node.user_anime_status];
      }}
      nodeCanvasObjectMode={() => 'before'}
      nodeCanvasObject={(node: GraphNode | any, ctx: CanvasRenderingContext2D, _) => {
        if (hoverNode) {
          if (hoverNodes.has(node)) {
            drawNodeBorder(node, ctx, hoverNode === node);
            return drawText(node, ctx);
          }
          return;
        }

        if (clickNode) {
          if (clickNodes.has(node)) {
            drawNodeBorder(node, ctx, clickNode === node);
            return drawText(node, ctx);
          }
          return;
        }

        if (search !== '') {
          if (node.title.toLowerCase().includes(search)) {
            drawNodeBorder(node, ctx);
            return drawText(node, ctx);
          }
          return;
        }

        showTitle && drawText(node, ctx);
      }}
      onNodeHover={handleNodeHover}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
      }}
      onNodeClick={handleNodeClick}
      linkLabel="relation"
      linkColor={(link: GraphLink | any) => {
        if (hoverNode) {
          if (hoverLinks.has(link)) {
            return activeColor;
          }
          return inactiveColor;
        }

        if (clickNode) {
          if (clickLinks.has(link)) {
            return activeColor;
          }
          return inactiveColor;
        }

        return linkColor[link.relation];
      }}
      linkCurvature={0.1}
      linkDirectionalArrowLength={10}
    />
  );
};

export default ForceGraph;

const drawText = (node: GraphNode | any, ctx: CanvasRenderingContext2D) => {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'black';
  ctx.strokeText(node.title, node.x, node.y + 15);
  ctx.fillStyle = activeColor;
  ctx.fillText(node.title, node.x, node.y + 15);
};

const drawNodeBorder = (
  node: GraphNode | any,
  ctx: CanvasRenderingContext2D,
  isMain: boolean = false,
) => {
  if (isMain) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10 * 1.3, 0, 2 * Math.PI, false);
    ctx.fillStyle = clickColor;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(node.x, node.y, 10 * 1.1, 0, 2 * Math.PI, false);
  ctx.fillStyle = activeColor;
  ctx.fill();
};
