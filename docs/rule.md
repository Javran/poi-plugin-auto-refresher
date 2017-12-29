This document defines `Rule` and related structures, which are internal
representation for user written configs.

## `Rule` structure

A `Rule` structure is an Object that contains at least the following shape:

```
{
  type: 'edge' / 'edgeId' / 'node',
}
```

## `edgeId` Rule

When type is `edgeId`, the shape should be:

```
{
  type: 'edgeId',
  edge: <number>,
}
```

The number of `edge` property should be an integer
indicating the in-game edge id.

## `edge` Rule

When type is `edge`, the shape should be:

```
{
  type: 'edge',
  begin: <string>,
  end: <string>,
}
```

Where `begin` and `end` are uppercase letters that
choose an edge from the map in question.

## `node` Rule

When type is `node`, the shape should be:

```
{
  type: 'node',
  node: <string>,
}
```

The property `node` should be a uppercase string that indicates one node of the map,
in this case, it selects all edges that goes to it.
