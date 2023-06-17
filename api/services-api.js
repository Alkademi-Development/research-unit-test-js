import supertest from 'supertest';

const request = supertest(process.env.SERVICES_API + 'v1/');

const paramsRequest = {
    sApp: 'S-App-Authorization',
    sAppToken: 'ab89d3a579eaf78207bd6e1f2fa88fb1cf1fce58b161a5f93462ea6cc81497df'
};

const apiParamsRequest = {
    Authorization: '2d3d736d0b4bb736d01af7f5ccc3b12d3b241b8eb6',
    AppToken: '692e44db271073fc:2d317a6d0a4dbb36d310ffffcac9b27a3d241487b2f656cc230d9e16c44bf0c9cec0c325c6af6191ac5bff749731046797454edeb88e7d0478e8a97cf31034005e64d89c748ef08765c86fb09cd6',
}

export {
    request,
    paramsRequest,
    apiParamsRequest
}