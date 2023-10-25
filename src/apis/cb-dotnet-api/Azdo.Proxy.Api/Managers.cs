internal class CloneManager
    : BaseManager<CloneWiCmd, CloneWiRes>, IManager<CloneWiReq, CloneWiResp>
{
    public CloneManager(IProcessor<CloneWiCmd, CloneWiRes> processor)
        : base(processor)
    {
    }

    public async Task<CloneWiResp> ManageAsync(CloneWiReq req)
    {
        await this._Processor.ProcessAsync(req.Cmd);
        return new CloneWiResp();
    }
}

internal class BulkCreateManager : BaseManager<CreateWiCmd, WiRes>, IManager<BulkCreateWiReq, BulkCreateWiResp>
{
    public BulkCreateManager(IProcessor<CreateWiCmd, WiRes> processor)
        : base(processor)
    {
    }

    public async Task<BulkCreateWiResp> ManageAsync(BulkCreateWiReq req)
    {
        await Task.WhenAll(req.Cmds.Select(this._Processor.ProcessAsync));
        return new BulkCreateWiResp();
    }
}

internal class DashboardManager : BaseManager<CreateDashboardWorkflowCmd, DashboardWorkflowRes>, IManager<CreateDashboardReq, CreateDashboardResp>
{
    public DashboardManager(IProcessor<CreateDashboardWorkflowCmd, DashboardWorkflowRes> processor)
        : base(processor)
    {
    }

    public async Task<CreateDashboardResp> ManageAsync(CreateDashboardReq req)
    {
        await this._Processor.ProcessAsync(req.Cmd);
        return new CreateDashboardResp();
    }
}
