internal interface IReq
{
}

internal interface IResp
{
}

internal record Req : IReq
{
}

internal record Resp : IResp
{
}

internal record CloneWiReq : Req
{
    public CloneWiCmd Cmd { get; init; } = new();
}

internal record CloneWiResp : Resp
{
    public CloneWiRes Res { get; init; } = new();
}

internal record CreateWiReq : Req
{
    public CreateWiCmd Cmd { get; init; } = new();
}

internal record CreateWiResp : Resp
{
    public WiRes Res { get; init; } = new();
}

internal record BulkCreateWiReq : Req
{
    public IEnumerable<CreateWiCmd> Cmds { get; init; } = new List<CreateWiCmd>();
}

internal record BulkCreateWiResp : Resp
{
    public IEnumerable<WiRes> Res { get; init; } = new List<WiRes>();
}

internal record CreateDashboardReq : Req
{
    public CreateDashboardWorkflowCmd Cmd { get; init; } = new();
}

internal record CreateDashboardResp : Resp
{
    public DashboardRes Res { get; init; } = new();
}
