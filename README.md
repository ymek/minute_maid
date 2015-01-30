Added Value Beverage Deltas
---------------------------

### Client data endpoints
An 'index' endpoint must be provided which responds with elements for the index
navigation page.  In addition to this endpoint, the cient expects data available in
JSON format from an endpoint for each navigation pair. For example the page at
`http://example.com/#/orange-juice/awareness` expects an API endpoint available at
`http://example.com/api/orange-juice/awareness`, while the page at
`http://example.com/#/lemonade/brand-imagery` expects an API endpoint available at
`http://example.com/api/lemonade/brand-imagery`. An endpoint must be provided following this
pattern for **each page** within the application.

### JSON Format (Index)
The index endpoint should respond with a logo image, headline, and
date range in the following format:
```javascript
{
  logo_image: "path/url to the header logo",
  headline: "text above navigation items",
  date_range: "English-language representation of dates these reports cover"
}
```
An example response for the `http://example.com/api/index.json` endpoint:
```javascript
{
  logo_image: "img/minute_maid.png",
  headline: "brandview",
  date_range: "3 months neding Nov'14"
}
```

### JSON Format (All Other)
Each endpoint should return a JSON object containing both `page_header` and `datasets` keys.
Each item within `datasets` represents a table, and each object item `brands` represents a
row within the table. Here is the format:
```javascript
{
  page_header: {
    category: "Category For Current Reports",
    period: "Period Current Reports Cover"
  },
  page_footer: {
    date_summary: "Summary For Current Report's Period",
    notes: "Any footnotes for the current report"
  },
  data_header: {
    percentage_header: "Month/Year Percentages Represent",
    delta_month_header: "Month/Year Delta 'from'",
    delta_stly_header: "Month/Year STLY Delta 'from'"
  },
  datasets: [
    {
      title: "",
      brands: [
        {
          icon_image: "http://example.com/path/to/logo.png",
          percentage_at_month: "value for 'percentage' column",
          delta_at_month: {
            value: "value for monthly delta",
            change: "one of: positive/negative/neutral; represents change from previous values"
          },
          delta_stly: {
            value: "absolute value for stly delta",
            change: "one of: positive/negative/neutral; represents change from previous values"
          }
        }
      ]
    }
  ]
}
```
Here is an example response for the `http://example.com/api/lemonade/brand-imagery` endpoint:
```javascript
{
  page_header: {
    category: "Lemonade",
    period: "3 months ending Nov'14"
  },
  page_footer: {
    date_summary: "Nov'14 (10/01/14 - 11/01/14)",
    notes: "Imagery in #{category} module a rating of Pure Squeezed and competitive products among those aware of Pure Squeezed"
  },
  data_header: {
    percentage_header: "Nov'14",
    delta_month_header: "&#916; from Oct'14",
    delta_stly_header: "&#916; from STLY"
  },
  datasets: [
    {
      title: "Total Ad Awareness",
      brands: [
        {
          icon_image: "tropicana.png",
          percentage_at_month: "25",
          delta_at_month: {
            value: "0",
            change: "neutral"
          },
          delta_stly: {
            value: "1",
            change: "positive"
          }
        },
        {
          icon_image: "minute_maid.png",
          percentage_at_month: "46",
          delta_at_month: {
            value: "0",
            change: "positive"
          },
          delta_stly: {
            value: "0",
            change: "neutral"
          }
        }
      ]
    },
    {
      title: "Unaided Brand Awareness",
      brands: [
        {
          icon_image: "tropicana.png",
          percentage_at_month: "25",
          delta_at_month: {
            value: "0",
            change: "negative"
          },
          delta_stly: {
            value: "1",
            change: "neutral"
          }
        },
        {
          icon_image: "minute_maid.png",
          percentage_at_month: "46",
          delta_at_month: {
            value: "0",
            change: "neutral"
          },
          delta_stly: {
            value: "0",
            change: "neutral"
          }
        }
      ]
    },
    {
      title: "Total Brand Awareness",
      brands: [
        {
          icon_image: "tropicana.png",
          percentage_at_month: "25",
          delta_at_month: {
            value: "0",
            change: "neutral"
          },
          delta_stly: {
            value: "1",
            change: "positive"
          }
        },
        {
          icon_image: "minute_maid.png",
          percentage_at_month: "46",
          delta_at_month: {
            value: "0",
            change: "neutral"
          },
          delta_stly: {
            value: "0",
            change: "neutral"
          }
        }
      ]
    }
  ]
}
```
Summary pages follow a slightly different format. These endpoints should pass a
`summary` key instead of the `datasets` key from other endpoints. Here is an
example response for the `http://example.com/api/lemonade/summary` endpoint:
```javascript
{
  page_header: {
    category: "Lemonade",
    summary: "Period Current Reports Cover"
  },
```
