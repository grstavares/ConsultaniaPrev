import { ObjectSchema, ValueType } from './validators';

export const Instituto: ObjectSchema = {
  required: {
    id: ValueType.string,
    name: ValueType.string,
    birthDate: ValueType.date,
    addresses: ValueType.object
  },
  optional: {},
}

const OldInstituto = {
  requiredProperties: {
    'id': 'string',
    'name': 'string',
    'birthDate': 'string',
    'address': 'array',
    'parametros': 'object' },
  schema: {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "The Root Schema",
    "required": [
      "id",
      "name",
      "birthDate",
      "addresses",
      "parametros"
    ],
    "properties": {
      "id": {
        "$id": "#/properties/id",
        "type": "string",
        "title": "The Id Schema",
        "default": "",
        "examples": [
          "eyJ0ZXN0IjoiYm9keSJ9"
        ],
        "pattern": "^(.*)$"
      },
      "name": {
        "$id": "#/properties/name",
        "type": "string",
        "title": "The Name Schema",
        "default": "",
        "examples": [
          "Gustavo Tavares"
        ],
        "pattern": "^(.*)$"
      },
      "birthDate": {
        "$id": "#/properties/birthDate",
        "type": "string",
        "title": "The Birthdate Schema",
        "default": "",
        "examples": [
          "15-11-1977"
        ],
        "pattern": "^(.*)$"
      },
      "addresses": {
        "$id": "#/properties/addresses",
        "type": "array",
        "title": "The Addresses Schema",
        "items": {
          "$id": "#/properties/addresses/items",
          "type": "object",
          "title": "The Items Schema",
          "required": [
            "cep",
            "city"
          ],
          "properties": {
            "cep": {
              "$id": "#/properties/addresses/items/properties/cep",
              "type": "string",
              "title": "The Cep Schema",
              "default": "",
              "examples": [
                "71915-250"
              ],
              "pattern": "^(.*)$"
            },
            "city": {
              "$id": "#/properties/addresses/items/properties/city",
              "type": "string",
              "title": "The City Schema",
              "default": "",
              "examples": [
                "Brasília"
              ],
              "pattern": "^(.*)$"
            }
          }
        }
      },
      "parametros": {
        "$id": "#/properties/parametros",
        "type": "object",
        "title": "The Parametros Schema",
        "required": [
          "senha",
          "tela"
        ],
        "properties": {
          "senha": {
            "$id": "#/properties/parametros/properties/senha",
            "type": "string",
            "title": "The Senha Schema",
            "default": "",
            "examples": [
              "aquela"
            ],
            "pattern": "^(.*)$"
          },
          "tela": {
            "$id": "#/properties/parametros/properties/tela",
            "type": "string",
            "title": "The Tela Schema",
            "default": "",
            "examples": [
              "principal"
            ],
            "pattern": "^(.*)$"
          }
        }
      }
    }
  }
  
}