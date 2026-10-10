using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MvcMovie.Data;

public class MvcMovieContextFactory : IDesignTimeDbContextFactory<MvcMovieContext>
{
    public MvcMovieContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<MvcMovieContext>();
        optionsBuilder.UseSqlite(
            configuration.GetConnectionString("MvcMovieContext")
            ?? throw new InvalidOperationException(
                "Connection string 'MvcMovieContext' not found."));

        return new MvcMovieContext(optionsBuilder.Options);
    }
}
