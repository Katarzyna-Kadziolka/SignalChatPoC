using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalChatPoC.Domain.Entities;
using SignalChatPoC.Infrastructure.Persistence;

namespace SignalChatPoC.Features.Messages;

[ApiController]
[Route("[controller]")]
public class MessageController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public List<Message> GetExistingMessages()
    {
        return dataContext.Messages
            .Include(m => m.Sender)
            .OrderByDescending(m => m.SentAt)
            .Take(10)
            .ToList();
    }
}