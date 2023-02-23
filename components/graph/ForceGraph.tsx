import * as React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { AnimeDrawerState, GraphData, GraphLink, GraphNode } from '../../types/Types';
import * as d3 from 'd3';
import AnimeDrawer from '../drawer/AnimeDrawer';

const inactiveColor = 'rgba(255,255,255,0.1)';
const activeColor = 'white';
const clickColor = 'red';

const ForceGraph = ({
  search,
  graphData,
  nodeColor,
  linkColor,
  showDetail,
  showTitle,
  showExtendedRelation,
  focusSearchTrigger,
}: {
  search: string;
  graphData: GraphData | any;
  nodeColor: any;
  linkColor: any;
  showDetail: boolean;
  showTitle: boolean;
  showExtendedRelation: boolean;
  focusSearchTrigger: number;
}) => {
  const graphRef: any = React.useRef();

  const [animeDrawerState, setAnimeDrawerState] = React.useState<AnimeDrawerState>({
    open: false,
    anime_id: 0,
  });

  const handleCloseAnimeDrawer = () => {
    setAnimeDrawerState({ open: false, anime_id: 0 });
  };

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
    showDetail && setAnimeDrawerState({ open: true, anime_id: node.anime_id });

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

  React.useEffect(() => {
    if (!showDetail && animeDrawerState.open) {
      handleCloseAnimeDrawer();
    }
  }, [showDetail]);

  const [searchFocusIndex, setSearchFocusIndex] = React.useState<number>(-1);

  const focusSearch = () => {
    if (!graphRef || !graphRef.current || search === '') return;

    const nodeResults = graphData.nodes.filter((n: GraphNode) => n.title.toLowerCase().includes(search));

    if (nodeResults.length === 0) return;

    if (nodeResults.length === 1) {
      graphRef.current.centerAt(nodeResults[0].x, nodeResults[0].y, 1000);
      graphRef.current.zoom(2, 1000);
      return;
    }

    if (searchFocusIndex >= 0) {
      graphRef.current.centerAt(
        nodeResults[searchFocusIndex % nodeResults.length].x,
        nodeResults[searchFocusIndex % nodeResults.length].y,
        1000,
      );
      graphRef.current.zoom(2, 1000);
    }
  };

  React.useEffect(() => {
    if (searchFocusIndex !== -1) {
      setSearchFocusIndex(-1);
    } else {
      focusSearch();
    }
  }, [search]);

  React.useEffect(() => {
    setSearchFocusIndex(searchFocusIndex + 1);
  }, [focusSearchTrigger]);

  React.useEffect(() => {
    focusSearch();
  }, [searchFocusIndex]);

  return (
    <>
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
      <AnimeDrawer
        open={animeDrawerState.open}
        anime_id={animeDrawerState.anime_id}
        onClose={handleCloseAnimeDrawer}
        nodes={graphData.nodes}
        nodeColor={nodeColor}
      />
    </>
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

const drawNodeBorder = (node: GraphNode | any, ctx: CanvasRenderingContext2D, isMain: boolean = false) => {
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
