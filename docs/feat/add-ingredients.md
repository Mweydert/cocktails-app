# Add ingredients to cocktails

## Data model
```plantuml
class Ingredient {
    id: uuid
    ---
    name: string
    --- 
    ' In future
    type: string
}
note right of Ingredient::type
One of [
    alcohol,
    fresh,
    juice,
    other
]
endnote

class Cocktail {
    id: uuid
    ---
    name: string
    note: number
    pictureId: string
}

Cocktail "n" -- "n" Ingredient
```

## API
UC:
1. ADD ingredient to ingredient list
    => No duplicate by name
2. GET ingredients in DB
    => Search by name
3. ATTACH ingredient to cocktail
    => At creation and update
    => Get cocktails with ingredients

## Front
Autocomplete input to add ingredients
- If no ingredient match, create one in DB
  - Modal to confirm ingredient creation (will enable to add more info such as ingredient type)
  - Add ingrediend to list when confirm modal
  - Ingredient cannot be used twice
- Create cocktail with ingredient 
- Displayed as tag in cocktial


## Future ideas

- Upload several pictures
- Get ingredients with cocktails