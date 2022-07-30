import * as React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { GraphData, GraphLink, GraphNode } from '../../types/Types';

const defaultNodeColor = 'black';
const defaultLinkColor = 'rgba(255,255,255,0.1)';
const inactiveColor = 'rgba(255,255,255,0.1)';
const activeColor = 'white';

const ForceGraph = ({
  graphData,
  nodeColor,
  linkColor,
}: {
  graphData: GraphData | any;
  nodeColor: any;
  linkColor: any;
}) => {
  const [highlightNodes, setHighlightNodes] = React.useState(new Set());
  const [highlightLinks, setHighlightLinks] = React.useState(new Set());
  const [hoverNode, setHoverNode] = React.useState<GraphNode | null>(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: GraphNode | any) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor: GraphNode) => highlightNodes.add(neighbor));
      node.links.forEach((link: GraphLink) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link: GraphLink | any) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      d3VelocityDecay={0.7}
      nodeLabel=""
      nodeRelSize={10}
      nodeColor={(node: GraphNode | any) => {
        if (!hoverNode || highlightNodes.has(node)) {
          return nodeColor[node.user_anime_status] || defaultNodeColor;
        }
        return inactiveColor;
      }}
      nodeCanvasObjectMode={() => 'before'}
      nodeCanvasObject={(node: GraphNode | any, ctx, _) => {
        if (!highlightNodes.has(node)) return;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = activeColor;
        ctx.fillText(node.title, node.x, node.y + 15);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 10 * 1.1, 0, 2 * Math.PI, false);
        ctx.fillStyle = activeColor;
        ctx.fill();
      }}
      onNodeHover={handleNodeHover}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
      }}
      linkLabel=""
      linkColor={(link: GraphLink | any) => {
        if (!hoverNode) return defaultLinkColor;
        if (highlightLinks.has(link)) return activeColor;
        return linkColor[link.relation] || defaultLinkColor;
      }}
      linkCurvature={0.1}
      linkDirectionalArrowLength={10}
      linkCanvasObjectMode={() => 'after'}
      linkCanvasObject={(link: GraphLink | any, ctx, _) => {
        if (!highlightLinks.has(link)) return;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = activeColor;
        ctx.fillText(
          link.relation.toLowerCase().replace('_', ' '),
          link.source.x + (link.source.x - link.target.x) / 2,
          link.source.y + (link.source.y - link.target.y) / 2,
        );
      }}
      onLinkHover={handleLinkHover}
    />
  );
};

export default ForceGraph;
