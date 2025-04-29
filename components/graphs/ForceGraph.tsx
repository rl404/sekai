/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCtx } from '@/components/context';
import AnimeDrawer from '@/components/drawers/AnimeDrawer';
import { AnimeDrawerRefType } from '@/components/drawers/types';
import { AnimeRelationToStr } from '@/libs/constant';
import * as d3 from 'd3';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';
import { LinkObject, NodeObject } from 'react-force-graph-2d';
import { Link, Node } from './types';

const ForceGraph2DClient = dynamic(() => import('./ForceGraph2D'), {
  ssr: false,
});

const ForceGraph = memo(() => {
  const ref = useRef<any>(null);
  const ctx = useCtx();

  const drawerRef = useRef<AnimeDrawerRefType>(null);
  const [drawerAnimeID, setDrawerAnimeID] = useState(0);

  const [hoverNode, setHoverNode] = useState<NodeObject | Node | null>(null);
  const [hoverNodes, setHoverNodes] = useState(new Set());
  const [hoverLinks, setHoverLinks] = useState(new Set());

  const [clickNode, setClickNode] = useState<NodeObject | Node | null>(null);
  const [clickNodes, setClickNodes] = useState(new Set());
  const [clickLinks, setClickLinks] = useState(new Set());

  const [searchFocusIndex, setSearchFocusIndex] = useState(-1);

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

    const nodeResults: Node | any = ctx.graph.nodes.filter((n) => n.title.toLowerCase().includes(ctx.nodeSearch));

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
    setClickNode(null);
    clickNodes.clear();
    clickLinks.clear();
  };

  const nodeColor = (node: NodeObject | Node): string => {
    if (hoverNode) {
      return hoverNodes.has(node) ? ctx.nodeColor[node.userAnimeStatus] : ctx.nodeColor['inactive'];
    }

    if (clickNode) {
      return clickNodes.has(node) ? ctx.nodeColor[node.userAnimeStatus] : ctx.nodeColor['inactive'];
    }

    if (ctx.nodeSearch !== '') {
      return node.title.toLowerCase().includes(ctx.nodeSearch)
        ? ctx.nodeColor[node.userAnimeStatus]
        : ctx.nodeColor['inactive'];
    }

    return ctx.nodeColor[node.userAnimeStatus];
  };

  const nodeCanvasObject = (node: NodeObject | Node, canvasCtx: CanvasRenderingContext2D) => {
    if (hoverNode) {
      if (!hoverNodes.has(node)) return;
      drawNodeBorder(node, canvasCtx, hoverNode === node);
      return drawText(node, canvasCtx);
    }

    if (clickNode) {
      if (!clickNodes.has(node)) return;
      drawNodeBorder(node, canvasCtx, clickNode === node);
      return drawText(node, canvasCtx);
    }

    if (ctx.nodeSearch !== '') {
      if (!node.title.toLowerCase().includes(ctx.nodeSearch)) return;
      drawNodeBorder(node, canvasCtx);
      return drawText(node, canvasCtx);
    }

    if (ctx.nodeTitle) drawText(node, canvasCtx);
  };

  const onNodeHover = (node: NodeObject | Node | null) => {
    hoverNodes.clear();
    hoverLinks.clear();

    if (node) {
      addRelatedHoverNodes(node);
    }

    setHoverNode(node || null);
  };

  const addRelatedHoverNodes = (node: NodeObject | Node) => {
    hoverNodes.add(node);

    node.neighbors.forEach((neighbor: Node) => {
      if (hoverNodes.has(neighbor)) return;
      hoverNodes.add(neighbor);
      if (ctx.linkExtended) addRelatedHoverNodes(neighbor);
    });

    node.links.forEach((link: Link) => {
      if (hoverLinks.has(link)) return;
      hoverLinks.add(link);
    });
  };

  const onNodeDragEnd = (node: Node | any) => {
    node.fx = node.x;
    node.fy = node.y;
  };

  const onNodeClick = (node: NodeObject | Node) => {
    if (ctx.nodeDetail) {
      setDrawerAnimeID(node.animeID);
      drawerRef.current?.setOpen(true);
    }

    clickNodes.clear();
    clickLinks.clear();

    if (clickNode === node) {
      setClickNode(null);
    } else {
      setClickNode(node);
      addRelatedClickNodes(node);
    }
  };

  const addRelatedClickNodes = (node: NodeObject | Node) => {
    clickNodes.add(node);

    node.neighbors.forEach((neighbor: NodeObject) => {
      if (clickNodes.has(neighbor)) return;
      clickNodes.add(neighbor);
      if (ctx.linkExtended) addRelatedClickNodes(neighbor);
    });

    node.links.forEach((link: LinkObject) => {
      if (clickLinks.has(link)) return;
      clickLinks.add(link);
    });
  };

  const linkLabel = (link: LinkObject | Link): string => {
    return AnimeRelationToStr(link.relation);
  };

  const linkColor = (link: LinkObject | Link): string => {
    if (hoverNode) {
      return hoverLinks.has(link) ? 'white' : ctx.linkColor['inactive'];
    }

    if (clickNode) {
      return clickLinks.has(link) ? 'white' : ctx.linkColor['inactive'];
    }

    return ctx.linkColor[link.relation];
  };

  return (
    <>
      <ForceGraph2DClient
        ref={ref}
        graphData={ctx.graph}
        onBackgroundClick={onBackgroundClick}
        nodeLabel=""
        nodeRelSize={10}
        nodeColor={nodeColor}
        nodeCanvasObjectMode={() => 'before'}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={onNodeHover}
        onNodeDragEnd={onNodeDragEnd}
        onNodeClick={onNodeClick}
        linkLabel={linkLabel}
        linkColor={linkColor}
        linkCurvature={0.1}
        linkDirectionalArrowLength={10}
      />
      <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />
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
