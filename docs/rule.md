This document defines `Rule` and related structures, which are internal
representation for user written configs. Processed `Rule`s are also described here,
which is a superset of `Rule` after processing.

## Unprocessed vs. Processed

When unspecified, a `Rule` always means **unprocessed** rule,
which represents what users have written and nothing more.

A **processed** rule adds some more info to the structure (therefore superset),
these info are never meant to be modified directly and considered derivable
from unprocessed rules,
and might even vary overtime (this happens when fcd map data changes).

Note that a Rule after processing could still remain unprocessed, this happens
if user input doesn't make sense for current fcd data.

To tell whether a rule is processed or not, look for existence of `check` property
and verify that its value is a function.

## `Rule` structure

A `Rule` structure is an Object that contains at least the following shape:

```
{
  type: 'edge' / 'edgeId' / 'node',
  (processed only) check: a function : edgeId => <bool>
}
```

`check` should be a function from `edgeId` to a `bool` value
indicating whether current `edgeId` matches this rule.

## `edgeId` Rule

When type is `edgeId`, the shape should be:

```
{
  type: 'edgeId',
  edgeId: <number>,
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
  (processed only) edgeId: <number>
}
```

Where `begin` and `end` are uppercase strings that
pick edges from the map in question.

## `node` Rule

When type is `node`, the shape should be:

```
{
  type: 'node',
  node: <string>,
  (processed only) edgeIds: Array of edgeId,
}
```

The property `node` should be a uppercase string that indicates one node of the map,
in this case, it selects all edges that goes to it.

`edgeIds` is an Array of all edges that point to the node in question.
