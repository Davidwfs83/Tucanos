using DataCommunicator.Pocos;


namespace DataCommunicator.IDataGenerators
{
    public abstract class IAllDataGenerator
    {       
        public abstract RecordsCount AllGenerator(RecordsCount rowsCount);
        protected abstract void AllCleaner();       
    }
}
