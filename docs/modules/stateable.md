[abstract-object](../README.md) / [Exports](../modules.md) / stateable

# Module: stateable

## Table of contents

### References

- [default](stateable.md#default)

### Variables

- [OBJECT\_STATES](stateable.md#object_states)
- [OBJECT\_STATES\_STR](stateable.md#object_states_str)

### Functions

- [stateable](stateable.md#stateable)

## References

### default

Renames and re-exports [stateable](stateable.md#stateable)

## Variables

### OBJECT\_STATES

• `Const` **OBJECT\_STATES**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `destroyed` | `any` |
| `destroying` | `number` |
| `inited` | `number` |
| `initing` | `number` |

#### Defined in

[src/stateable.js:7](https://github.com/snowyu/abstract-object/blob/4cb0150/src/stateable.js#L7)

___

### OBJECT\_STATES\_STR

• `Const` **OBJECT\_STATES\_STR**: `string`[]

#### Defined in

[src/stateable.js:14](https://github.com/snowyu/abstract-object/blob/4cb0150/src/stateable.js#L14)

## Functions

### stateable

▸ **stateable**<`T`\>(`targetClass?`, `options?`): `EnhancedClass`<`T`, typeof `Stateable`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ClassEx` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetClass?` | `T` |
| `options?` | `AbilityOptions` |

#### Returns

`EnhancedClass`<`T`, typeof `Stateable`\>

#### Defined in

node_modules/custom-ability/lib/index.d.ts:33
