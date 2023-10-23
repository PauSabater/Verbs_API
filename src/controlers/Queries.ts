// function buildQuery(queryParams: {verb: string}) {
//     const query: { verb?: string } = {}

//     if (queryParams.verb) {
//         query.verb = queryParams.verb
//     }

//     // if (queryParams.category) {
//     //     query.category = queryParams.category
//     // }

//     if (queryParams.priceMin && queryParams.priceMax) {
//         query.price = {
//             $gte: queryParams.priceMin,
//             $lte: queryParams.priceMax
//         }
//     } else if (queryParams.priceMin) {
//         query.price = { $gte: queryParams.priceMin }
//     } else if (queryParams.priceMax) {
//         query.price = { $lte: queryParams.priceMax }
//     }

//     return query
// }
