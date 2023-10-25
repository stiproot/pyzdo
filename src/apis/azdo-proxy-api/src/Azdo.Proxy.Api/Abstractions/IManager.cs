internal interface IManager<in TIn, TOut>
  where TIn : IReq
  where TOut : IResp
{
    Task<TOut> ManageAsync(TIn input);
}

internal abstract class BaseManager<TProcessorCmd, TProcessorRes>
  where TProcessorCmd : IProcessorCmd
  where TProcessorRes : IProcessorRes
{
    protected readonly IProcessor<TProcessorCmd, TProcessorRes> _Processor;

    protected BaseManager(IProcessor<TProcessorCmd, TProcessorRes> processor)
        => _Processor = processor;
}
