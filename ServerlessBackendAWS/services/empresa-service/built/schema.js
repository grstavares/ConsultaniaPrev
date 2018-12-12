"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instituto = {
    "$id": "https://consultania.com.br/instituto.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "InstitutoPrevidencia",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "description": "Unique identifier of Instituto"
        },
        "alias": {
            "type": "string",
            "description": "Alias"
        },
        "fullName": {
            "description": "Age in years which must be equal to or greater than zero.",
            "type": "string",
            "minimum": 0
        },
        "counter": {
            "description": "Age in years which must be equal to or greater than zero.",
            "type": "integer",
            "minimum": 0
        }
    }
};
