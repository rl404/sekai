import * as d3 from 'd3';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';
import { LinkObject, NodeObject } from 'react-force-graph-2d';
import { useCtx } from '@/src/components/context';
import { Link, Node } from '@/src/components/graphs/types';
import { AnimeRelationToStr } from '@/src/libs/constant';
import { activeLinkColor, defaultLinkColor, defaultNodeColor, getRelatedIDs, hasLink } from '@/src/libs/graph';

const ForceGraph2DClient = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

const ForceGraph = memo(function ForceGraph() {
  const ctx = useCtx();

  const ref = useRef<any>(null);

  const [hoverNodeID, setHoverNodeID] = useState(0);
  const [hoverNodeIDs, setHoverNodeIDs] = useState<Set<number>>(new Set());
  const [hoverLinks, setHoverLinks] = useState<Link[]>([]);

  const [clickNodeID, setClickNodeID] = useState(0);
  const [clickNodeIDs, setClickNodeIDs] = useState<Set<number>>(new Set());
  const [clickLinks, setClickLinks] = useState<Link[]>([]);

  const [searchFocusIndex, setSearchFocusIndex] = useState(-1);
  const [searchResult, setSearchResult] = useState<Node[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.d3Force('collide', d3.forceCollide().radius(30));
  }, [ref.current]);

  useEffect(() => {
    if (searchFocusIndex !== -1) {
      setSearchFocusIndex(-1);
    } else {
      focusSearch();
    }
  }, [ctx.nodeSearch]);

  useEffect(() => {
    setSearchFocusIndex(searchFocusIndex + 1);
  }, [ctx.graphFocusTrigger]);

  useEffect(() => {
    focusSearch();
  }, [searchFocusIndex]);

  const focusSearch = () => {
    if (!ref || !ref.current || ctx.nodeSearch === '') return;

    const nodeResults = ctx.graphData.nodes.filter((n) => n.title.toLowerCase().includes(ctx.nodeSearch.toLowerCase()));
    setSearchResult(nodeResults);

    if (nodeResults.length === 0) return;

    if (nodeResults.length === 1) {
      ref.current.centerAt(nodeResults[0].x, nodeResults[0].y, 1000);
      ref.current.zoom(2, 1000);
      return;
    }

    if (searchFocusIndex >= 0) {
      ref.current.centerAt(
        nodeResults[searchFocusIndex % nodeResults.length].x,
        nodeResults[searchFocusIndex % nodeResults.length].y,
        1000,
      );
      ref.current.zoom(2, 1000);
    }
  };

  const onBackgroundClick = () => {
    setClickNodeID(0);
    setClickNodeIDs(new Set());
    setClickLinks([]);
  };

  const nodeColor = (node: Node): string => {
    if (hoverNodeID !== 0) {
      return hoverNodeIDs.has(node.id) ? ctx.nodeColor[node.userAnimeStatus] : defaultNodeColor;
    }

    if (clickNodeID !== 0) {
      return clickNodeIDs.has(node.id) ? ctx.nodeColor[node.userAnimeStatus] : defaultNodeColor;
    }

    if (ctx.nodeSearch !== '') {
      return node.title.toLowerCase().includes(ctx.nodeSearch.toLowerCase())
        ? ctx.nodeColor[node.userAnimeStatus]
        : defaultNodeColor;
    }

    return ctx.nodeColor[node.userAnimeStatus];
  };

  const nodeCanvasObject = (node: Node, canvasCtx: CanvasRenderingContext2D) => {
    if (hoverNodeID !== 0) {
      if (!hoverNodeIDs.has(node.id)) return;
      drawNodeBorder(node, canvasCtx, hoverNodeID === node.id);
      return drawText(node, canvasCtx);
    }

    if (clickNodeID !== 0) {
      if (!clickNodeIDs.has(node.id)) return;
      drawNodeBorder(node, canvasCtx, clickNodeID === node.id);
      return drawText(node, canvasCtx);
    }

    if (ctx.nodeSearch !== '') {
      if (!node.title.toLowerCase().includes(ctx.nodeSearch.toLowerCase())) return;
      drawNodeBorder(node, canvasCtx, searchResult[searchFocusIndex % searchResult.length]?.id === node.id);
      return drawText(node, canvasCtx);
    }

    if (ctx.showNodeTitle) drawText(node, canvasCtx);
  };

  const onNodeHover = (node: Node | null) => {
    setHoverNodeID(0);
    setHoverNodeIDs(new Set());
    setHoverLinks([]);

    if (node) {
      const relatedIDs = new Set([node.id, ...getRelatedIDs(ctx.graphData.nodes, node.id, ctx.showLinkExtended)]);
      setHoverNodeID(node.id);
      setHoverNodeIDs(new Set(relatedIDs));
      setHoverLinks([
        ...ctx.graphData.links.filter((link) =>
          ctx.showLinkExtended
            ? relatedIDs.has(link.sourceID) || relatedIDs.has(link.targetID)
            : link.sourceID === node.id || link.targetID === node.id,
        ),
      ]);
    }
  };

  const onNodeDragEnd = (node: Node) => {
    node.fx = node.x;
    node.fy = node.y;
  };

  const onNodeClick = (node: Node) => {
    if (ctx.showNodeDetail) {
      ctx.onOpenDrawer(node.id);
    }

    setClickNodeID(0);
    setClickNodeIDs(new Set());
    setClickLinks([]);

    if (clickNodeID !== node.id) {
      const relatedIDs = new Set([node.id, ...getRelatedIDs(ctx.graphData.nodes, node.id, ctx.showLinkExtended)]);
      setClickNodeID(node.id);
      setClickNodeIDs(new Set(relatedIDs));
      setClickLinks([
        ...ctx.graphData.links.filter((link) =>
          ctx.showLinkExtended
            ? relatedIDs.has(link.sourceID) || relatedIDs.has(link.targetID)
            : link.sourceID === node.id || link.targetID === node.id,
        ),
      ]);
    }
  };

  const linkLabel = (link: Link): string => {
    return AnimeRelationToStr(link.relation);
  };

  const linkColor = (link: Link): string => {
    if (hoverNodeID !== 0) {
      return hasLink(hoverLinks, link) ? activeLinkColor : defaultLinkColor;
    }

    if (clickNodeID !== 0) {
      return hasLink(clickLinks, link) ? activeLinkColor : defaultLinkColor;
    }

    return defaultLinkColor;
  };

  return (
    <>
      <ForceGraph2DClient
        ref={ref}
        graphData={ctx.graphData}
        onBackgroundClick={onBackgroundClick}
        nodeLabel=""
        nodeRelSize={10}
        nodeColor={nodeColor as (n: NodeObject) => string}
        nodeCanvasObjectMode={() => 'before'}
        nodeCanvasObject={nodeCanvasObject as (n: NodeObject, _ctx: CanvasRenderingContext2D) => void}
        onNodeHover={onNodeHover as (n: NodeObject | null) => void}
        onNodeDragEnd={onNodeDragEnd as (n: NodeObject) => void}
        onNodeClick={onNodeClick as (n: NodeObject) => void}
        linkLabel={linkLabel as (l: LinkObject) => string}
        linkColor={linkColor as (l: LinkObject) => string}
        linkCurvature={0.1}
        linkDirectionalArrowLength={10}
      />
    </>
  );
});

export default ForceGraph;

const drawText = (node: Node | any, ctx: CanvasRenderingContext2D) => {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'black';
  ctx.strokeText(node.title, node.x, node.y + 15);
  ctx.fillStyle = 'white';
  ctx.fillText(node.title, node.x, node.y + 15);
};

const drawNodeBorder = (node: Node | any, ctx: CanvasRenderingContext2D, isMain: boolean = false) => {
  if (isMain) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10 * 1.3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(node.x, node.y, 10 * 1.1, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'white';
  ctx.fill();
};
