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

[src/stateable.js:7](https://github.com/snowyu/abstract-object/blob/5cbd886/src/stateable.js#L7)

___

### OBJECT\_STATES\_STR

• `Const` **OBJECT\_STATES\_STR**: `string`[]

#### Defined in

[src/stateable.js:14](https://github.com/snowyu/abstract-object/blob/5cbd886/src/stateable.js#L14)

## Functions

### stateable

▸ **stateable**(`targetClass`, `options?`): `Function`

A function that adds(injects) the ability of a specified ability class to a target class.

Note: Maybe the ability will be injected into the inheritance class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `targetClass` | `Function` | The target class to which the ability will be added. |
| `options?` | `AbilityOptions` | An optional ability configuration object. |

#### Returns

`Function`

- An injected target class that takes a class and adds the ability to it using the specified
                      options.

#### Defined in

node_modules/custom-ability/lib/custom-ability.d.ts:103
