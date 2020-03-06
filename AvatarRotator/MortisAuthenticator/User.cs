namespace MortisAuthenticator
{
    internal class User
    {
        public int uid { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string salt { get; set; }
    }
}