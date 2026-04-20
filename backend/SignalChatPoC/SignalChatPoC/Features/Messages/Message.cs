using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Features.Messages;

public class Message
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; }
    public string? GroupName { get; set; }
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
}