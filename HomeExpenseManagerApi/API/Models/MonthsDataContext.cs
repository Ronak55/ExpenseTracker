using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class MonthsDataContext : DbContext
    {

        public MonthsDataContext(DbContextOptions options) : base(options){
        

        }

        public DbSet<MonthsData> MonthsData { get; set; }
    }
}
