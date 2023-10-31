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
    }
}
