This document describes config syntax written by a user.

## Config Syntax

Config syntax is organized by lines, each line itself should be interpreted
individually as if it's entered on main plugin part.

There are two types of config lines: one (we will call this "rule line")
defines matching rules for a specific sortie area,
and another (called "toggle line") toggles all rules for a specific sortie area.

### Rule Line Syntax

The most common syntax for rule line is:

```
<map indicator>, <rule 1>, <rule 2>, <rule 3> ...
```

which is a map indicator followed by non-empty number of rules,
separated by comma.

A map indicator follows the convention: `2-3` means world 2, sortie area 3.
There is also a shorthand for map indicator, which is simply omitting the `-` in between -
`23` is the same as `2-3`.

There are three types of rules (all rules are case-insensitive):

- **Node** Rule matchs every edge that points to that specific node.

    e.g. a simple letter `A` means all edges that goes to `A`

- **Edge** Rule allows indicating both start and end of an edge, and matches just that edge.

    e.g. `A->B`. There could be spaces before and after `->`, but not in between

- **Edge Id** This rule allows matching edge id if you happen to know it. Useful when
  some extra data like FCD is not available.

    e.g. A complete rule line: `2-2,4` means edge
    that goes from `E` to `G` (indicated by `4`) of map `2-2`

Prefixing an exclamation `!` right in front of a rule disables it, e.g. `!A` is a rule that matches
node `A`, but it will not trigger due to being disabled.

It is optional to prefix `r,` in front of any rule line, which has no different than without:
`r,2-2,A` or `2-2,A` or `22,A` do not have any difference in semantics.

## Toggle Line Syntax

To toggle a line, use:

```
t,<map indicator>,<0 or 1>
```

Example: `t,22,0` disables all rules for map 2-2 (note that each rule has its own toggle,
which is *not* affected by this toggle). And `t,22,1` enables it.

You don't have to enable a map as every map is enabled by default.
