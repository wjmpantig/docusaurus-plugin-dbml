---
sidebar_position: 5
---

# Examples

Every diagram on this page is a plain ` ```dbml ` fence in this page's source.
Click **Code** on any of them to see the exact DBML.

The schemas are deliberately small, so the feature being shown is visible without
panning. For everything at once, see the [Showcase](./showcase.md).

## The minimum

A table and its columns. No options, no relationships.

```dbml
Table users {
  id integer [pk, increment]
  email varchar(254) [not null, unique]
  name varchar
}
```

## Column settings

Primary keys, auto-increment, `not null` and `unique` all render as badges.
Defaults are rendered by kind, so an expression does not read as a string
literal. Notes attach to the column they document.

```dbml
Table public.users as U [headercolor: #3498DB] {
  id          bigint       [pk, increment]
  email       varchar(254) [not null, unique]
  login_count int          [not null, default: 0]
  timezone    text         [default: '+08:00']
  created_at  timestamptz  [not null, default: `now()`]
  is_verified boolean      [not null, default: false]
  referrer_id bigint       [note: 'Points at another row in this table']
  bio         text         [note: '''
  Free-form profile text.
  Line breaks in notes are preserved.
  ''']

  note: 'Application end users'
}
```

Note the alias (`as U`), the custom `headercolor`, and the table-level `note`.

## Enums

Enums render as their own nodes, including any enum nothing references — so a
lookup type you have defined but not wired up yet is still visible.

```dbml
Enum user_status {
  ACTIVE
  INACTIVE
  BANNED [note: 'Blocked from signing in']
}

Enum currency_code {
  PHP
  USD
  JPY
}

Table accounts {
  id      bigint        [pk, increment]
  status  user_status   [not null, default: 'ACTIVE']
  balance numeric(12,2) [not null, default: 0]
}
```

`currency_code` is referenced by nothing and still appears.

## Relationships

Inline refs, standalone `Ref:` blocks, one-to-one, one-to-many, a self
reference, a named ref with its own colour and delete action, and a documented
but unenforced `[inactive]` ref drawn dashed.

```dbml
Table users {
  id          bigint [pk, increment]
  referrer_id bigint
}

Table user_profiles {
  user_id bigint [pk]
  bio     text
}

Table orders {
  id      bigint      [pk, increment]
  user_id bigint      [not null, ref: > users.id]
  status  varchar(32) [not null, default: 'PENDING']
}

Table order_items {
  id           bigint [pk, increment]
  order_id     bigint [not null]
  menu_item_id bigint [not null]
}

Table menu_items {
  id   bigint       [pk, increment]
  name varchar(120) [not null]
}

// one-to-one
Ref: users.id - user_profiles.user_id

// self-reference
Ref: users.id < users.referrer_id

// named, coloured, with a delete action
Ref fk_order_items_order: orders.id < order_items.order_id [color: #79AD51, delete: cascade]

// documented, not enforced by the database
Ref: menu_items.id < order_items.menu_item_id [inactive]
```

Hover a column to highlight everything it connects to.

## Optional and many-to-many

The `>?` and `<>` operators need `@dbml/core` v10 — on v5 they do not parse at
all.

```dbml
Table branches {
  id   bigint       [pk, increment]
  name varchar(120) [not null]
}

Table delivery_zones {
  id        bigint [pk, increment]
  fee_cents int    [not null, default: 0]
}

Table restaurants {
  id   bigint       [pk, increment]
  name varchar(120) [not null]
}

Table users {
  id bigint [pk, increment]
}

// a branch may have no delivery zone
Ref: branches.id >? delivery_zones.id [delete: set null]

// many-to-many
Ref: users.id <> restaurants.id
```

Cardinality is drawn at each end of the edge: `1`, `0..1`, `*`, `0..*`.

## Indexes and checks

Both get their own section under the columns.

```dbml
Table orders {
  id            bigint        [pk, increment]
  user_id       bigint        [not null]
  restaurant_id bigint        [not null]
  status        varchar(32)   [not null, default: 'PENDING']
  placed_at     timestamptz   [not null, default: `now()`]
  total_amount  numeric(12,2) [not null]
  surcharge     int           [not null, default: 0]

  Indexes {
    (user_id, placed_at) [name: 'idx_orders_user_placed_at']
    (restaurant_id, placed_at)
    id [unique, name: 'uq_orders_id']
    `lower(status)` [name: 'idx_orders_status_lower', type: btree]
  }

  checks {
    `total_amount >= 0` [name: 'chk_total_non_negative']
    `surcharge >= 0`
  }
}
```

## Composite keys and composite refs

A composite reference pairs its columns positionally and draws one edge per
pair — not a single edge implying the other columns are uninvolved.

```dbml
Table regions {
  country_code char(2)      [not null]
  region_code  varchar(8)   [not null]
  name         varchar(100) [not null]

  Indexes {
    (country_code, region_code) [pk, name: 'pk_regions']
  }

  note: '''
  Composite primary key.
  Both columns take part in the ref below.
  '''
}

Table delivery_zones {
  id           bigint     [pk, increment]
  country_code char(2)    [not null]
  region_code  varchar(8) [not null]
}

Ref: delivery_zones.(country_code, region_code) > regions.(country_code, region_code)
```

## Groups, sticky notes and schemas

Table groups draw as a labelled backdrop behind their members. Sticky notes are
free-floating `Note` blocks. Tables in different schemas can reference each
other.

This one is set to `height=650`, because the default 500 crops it.

```dbml height=650
Project sample_app_db {
  database_type: 'PostgreSQL'
  note: 'Table groups, sticky notes and cross-schema refs'
}

Table public.users {
  id    bigint       [pk, increment]
  email varchar(254) [not null, unique]
}

Table payments.payment_methods {
  id      bigint [pk, increment]
  user_id bigint [not null, ref: > public.users.id]
  token   text   [not null, note: 'Token reference only; no card numbers stored']
}

Table payments.payment_intents {
  id                bigint        [pk, increment]
  payment_method_id bigint        [ref: > payments.payment_methods.id]
  amount            numeric(12,2) [not null]
}

TableGroup public_app {
  note: 'Core public schema tables used by the consumer app'

  public.users
}

TableGroup payments_core [color: #79AD51] {
  note: 'Owned by the payments service'

  payments.payment_methods
  payments.payment_intents
}

Note design_reminder [color: #F4D03F] {
  '''
  Payments tables are owned by the payments service.
  Do not add cross-schema foreign keys without an ADR.
  '''
}

Note floating_label [color: none] {
  'A sticky note with no background'
}
```

## Height, both ways

The same schema twice. This one is `height=250`:

```dbml height=250
Table users {
  id    bigint       [pk, increment]
  email varchar(254) [not null, unique]
}

Table sessions {
  id      bigint      [pk, increment]
  user_id bigint      [not null, ref: > users.id]
  expires timestamptz [not null]
}
```

And this one is `height=50vh` — a share of the viewport rather than a pixel
count, so it scales with the window:

```dbml height=50vh
Table users {
  id    bigint       [pk, increment]
  email varchar(254) [not null, unique]
}

Table sessions {
  id      bigint      [pk, increment]
  user_id bigint      [not null, ref: > users.id]
  expires timestamptz [not null]
}
```
