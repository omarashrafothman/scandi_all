import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($sku_id: Int!) {
    product(sku_id: $sku_id) {
      id
      name
      description
      galleries {
        image_url
      }
      prices {
        currency_symbol
        amount
      }
      attributes {
        name
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query getAllProducts {
    products {
      id
      name
      price
      category
    }
  }
`;