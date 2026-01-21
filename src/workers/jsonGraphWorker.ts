/// <reference lib="webworker" />

import { parseTree, ParseError } from 'jsonc-parser';
import { applyLayout } from '../utils/layout';
import { transformAstToGraph } from '../utils/parser';
import { JsonEdge, JsonNode } from '../types';

type WorkerRequest = {
  id: number;
  json: string;
};

type WorkerResponse = {
  id: number;
  nodes?: JsonNode[];
  edges?: JsonEdge[];
  errors?: ParseError[];
};

const ctx: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, json } = event.data;
  const errors: ParseError[] = [];
  const ast = parseTree(json, errors);

  if (!ast || errors.length > 0) {
    ctx.postMessage({ id, errors } satisfies WorkerResponse);
    return;
  }

  const { nodes, edges } = transformAstToGraph(ast);
  const layoutedNodes = applyLayout(nodes, edges);

  ctx.postMessage({ id, nodes: layoutedNodes, edges } satisfies WorkerResponse);
};
