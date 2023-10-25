internal static class Endpoints
{
    public static void MapEndpoints(this WebApplication @this)
    {
        @this.MapPost("/azdo/clone", async (CloneWiReq req, IManager<CloneWiReq, CloneWiResp> manager) =>
        {
            var res = await manager.ManageAsync(req);
            return Results.Ok(res);
        });

        @this.MapPost("/azdo/bulk/create", async (BulkCreateWiReq req, IManager<BulkCreateWiReq, BulkCreateWiResp> manager) =>
        {
            var res = await manager.ManageAsync(req);
            return Results.Ok(res);
        });

        @this.MapPost("/azdo/dashboard", async (CreateDashboardReq req, IManager<CreateDashboardReq, CreateDashboardResp> manager) =>
        {
            var res = await manager.ManageAsync(req);
            return Results.Ok(res);
        });

        // @this.MapGet("/health", async () =>
        // {
        //     const string KEY = "OnY0M3RsN2dmdXRqbTZwdWhwejdocG1jajc1NWpxbXk2cXgyYWRmd2ZlemNvdjRoaHoyeXE=";
        //     const string URL = "https://dev.azure.com/Derivco/Software/_apis/wit/workitems/1116071?$expand=all&api-version=7.0";
        //     var req = new HttpRequestMessage(HttpMethod.Get, URL);

        //     HttpClient client = new HttpClient();
        //     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", KEY);


        //     var resp = await client.SendAsync(req);
        //     var respContent = await resp.Content.ReadAsStringAsync();
        //     return Results.Ok(respContent);
        // });

        // @this.MapGet("/health/cert/one", async () =>
        // {
        //     const string PATH = "/root/.aspnet/https/aspnetcore-localhost-F49228DDFD1771875A1B6D9415EC27363D3DA105.pfx";
        //     const string KEY = "OnY0M3RsN2dmdXRqbTZwdWhwejdocG1jajc1NWpxbXk2cXgyYWRmd2ZlemNvdjRoaHoyeXE=";
        //     const string URL = "https://dev.azure.com/Derivco/Software/_apis/wit/workitems/1116071?$expand=all&api-version=7.0";
        //     var req = new HttpRequestMessage(HttpMethod.Get, URL);

        //     HttpClientHandler handler = new HttpClientHandler();
        //     handler.ClientCertificates.Add(new System.Security.Cryptography.X509Certificates.X509Certificate2(PATH, "crypticpassword"));
        //     HttpClient client = new HttpClient(handler);
        //     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", KEY);

        //     var resp = await client.SendAsync(req);
        //     var respContent = await resp.Content.ReadAsStringAsync();
        //     return Results.Ok(respContent);
        // });

        // @this.MapGet("/health/cert/two", async () =>
        // {
        //     const string PATH = "/root/.aspnet/https/azdo.proxy.api.pfx";
        //     const string KEY = "OnY0M3RsN2dmdXRqbTZwdWhwejdocG1jajc1NWpxbXk2cXgyYWRmd2ZlemNvdjRoaHoyeXE=";
        //     const string URL = "https://dev.azure.com/Derivco/Software/_apis/wit/workitems/1116071?$expand=all&api-version=7.0";
        //     var req = new HttpRequestMessage(HttpMethod.Get, URL);

        //     HttpClientHandler handler = new HttpClientHandler();
        //     handler.ClientCertificates.Add(new System.Security.Cryptography.X509Certificates.X509Certificate2(PATH, "crypticpassword"));
        //     HttpClient client = new HttpClient(handler);
        //     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", KEY);

        //     var resp = await client.SendAsync(req);
        //     var respContent = await resp.Content.ReadAsStringAsync();
        //     return Results.Ok(respContent);
        // });

        // @this.MapGet("/health/cert/none", async () =>
        // {
        //     const string KEY = "OnY0M3RsN2dmdXRqbTZwdWhwejdocG1jajc1NWpxbXk2cXgyYWRmd2ZlemNvdjRoaHoyeXE=";
        //     const string URL = "https://dev.azure.com/Derivco/Software/_apis/wit/workitems/1116071?$expand=all&api-version=7.0";
        //     var req = new HttpRequestMessage(HttpMethod.Get, URL);

        //     HttpClientHandler clientHandler = new HttpClientHandler();
        //     clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        //     HttpClient client = new HttpClient(clientHandler);
        //     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", KEY);


        //     var resp = await client.SendAsync(req);
        //     var respContent = await resp.Content.ReadAsStringAsync();
        //     return Results.Ok(respContent);
        // });
    }
}
