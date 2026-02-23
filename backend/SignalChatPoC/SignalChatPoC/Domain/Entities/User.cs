namespace SignalChatPoC.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Message> Messages { get; set; }
}