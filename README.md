This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview
This application renders a form and exposes an API calculation according to the specification of the [SINAI Fullstack Engineer Take-home Challenge](https://www.notion.so/sinaitechnologies/Fullstack-Engineer-Take-home-Challenge-a06771fbb9134092adea6c7b729a35ea)

```
Build a full-stack personal carbon footprint calculator:

- Implement **two or more categories** from [this guide](https://www.notion.so/Fullstack-Engineer-Take-home-Challenge-a06771fbb9134092adea6c7b729a35ea)
    - You can use [this database of emissions factors](https://www.notion.so/Fullstack-Engineer-Take-home-Challenge-a06771fbb9134092adea6c7b729a35ea) or any other factors you find on the internet
    - If you need some inspiration, check out the [EPA’s household calculator](https://www3.epa.gov/carbon-footprint-calculator/) (use zip code 94114)
- Emissions calculations should be performed by the backend and exposed via APIs
    - We use NodeJS/Express, but you can use any framework
    - We use GraphQL, but feel free to use REST or any other standard
    - **No need to store data in the backend, just expose the calculations**
- The frontend should be in React
    - Use `create-react-app` or `next.js` to bootstrap your app
    - Use [Ant Design components](https://ant.design/components/button/) (or another component library) instead of creating your own
```

## Development

First, run `yarn` to install packages locally.

Run `yarn dev` to run the development server and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Commands
- `yarn lint`
- `yarn test`
  - `yarn test <specific-file.test.ts>`
  - `yarn test-client`
  - `yarn test-server`

## Deployment

This app is deployed using use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. 
- non-main branches are auto-built and deployed as preview sites. There can be up to 5 at once
- main branch is auto-rebuilt and deployed to main site [`carbon-calculator-next-ts.vercel.app`](carbon-calculator-next-ts.vercel.app)


Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Code architecture
This NextJS project is essentially a mono-repo that provides a client bundle alongside a serverless function. The project heavily relies on sharing TypeScript types to provide type safety and implicit documentation for the API and its consumer.

The code is structured according to NextJS convention, with the `pages` folder implicitly defining the UI and API routes.

* UI is defined in `pages/index.tsx` with components in `components/...` 
* API is defined in `pages/api/calculate.ts`
* Tests are co-located with the source code, with the exception of `pages` (see `components/pages/README.md` for details)
* Additional abstractions are defined under `lib` (`EmissionsCalculator, apiClient, middlewares`)

### API design
See [design doc](https://docs.google.com/document/d/1CXUhj5IibDofY0_00KOctsTjEd2b2JSCzZKFSt3eIKg/edit) for an in-depth breakdown.

### Lint configuration

By default, the lint command (which uses `next lint` under the hood) only includes `components, lib, pages` folders. For simplicity, all code is organized within this limited structure.

See `.eslintrc.json` for additional configuration.

### Test configuration

Test coverage and jest options are defined under
* `jest.client.config.js`
* `jest.server.config.js`

Test environment setup (run before tests) is defined under
* `jest.client.setup.js`

