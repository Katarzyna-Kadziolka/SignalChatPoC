using Microsoft.EntityFrameworkCore;
using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Infrastructure.Persistence;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Message> Messages { get; set; }
}