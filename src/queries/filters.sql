SELECT 
  'category' AS filterCategory,
  JSON_ARRAYAGG(category) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT category FROM products) AS distinct_categories

UNION ALL

SELECT 
  'price' AS filterCategory,
  JSON_ARRAY('0-50', '50-100', '100-200', '200-300', '300-400', 'ab 400' ) AS filterOptions,
  'range' AS inputType

UNION ALL

SELECT 
  'color' AS filterCategory,
  JSON_ARRAYAGG(name) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT name FROM colors) AS distinct_colors

UNION ALL

SELECT 
  'size' AS filterCategory,
  JSON_ARRAYAGG(size) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT size FROM sizes) AS distinct_sizes

UNION ALL

SELECT 
  'brand' AS filterCategory,
  JSON_ARRAYAGG(brand) AS filterOptions,
  'checkbox' AS inputType
FROM (SELECT DISTINCT brand FROM products) AS distinct_brands

UNION ALL

SELECT 
  'discount' AS filterCategory,
  JSON_ARRAY('Ja', 'Nein') AS filterOptions,
  'radio' AS inputType;
