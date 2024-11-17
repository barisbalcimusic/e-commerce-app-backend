SELECT 
  'Kategorie' AS filterCategory,
  JSON_ARRAYAGG(category) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT category FROM products) AS distinct_categories

UNION ALL

SELECT 
  'Preis' AS filterCategory,
  JSON_ARRAY('0-50€', '50-100€', '100-200€') AS filterOptions,
  'checkbox' AS inputType

UNION ALL

SELECT 
  'Farbe' AS filterCategory,
  JSON_ARRAYAGG(name) AS filterOptions, -- 'color' yerine 'name' kullanıldı
  'checkbox' AS inputType
FROM (SELECT DISTINCT name FROM colors) AS distinct_colors

UNION ALL

SELECT 
  'Größe' AS filterCategory,
  JSON_ARRAYAGG(size) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT size FROM sizes) AS distinct_sizes

UNION ALL

SELECT 
  'Marke' AS filterCategory,
  JSON_ARRAYAGG(brand) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT brand FROM products) AS distinct_brands

UNION ALL

SELECT 
  'Sale' AS filterCategory,
  JSON_ARRAY('Ja', 'Nein') AS filterOptions,
  'radio' AS inputType;
