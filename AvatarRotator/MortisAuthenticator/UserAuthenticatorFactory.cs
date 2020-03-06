namespace MortisAuthenticator
{
    public static class UserAuthenticatorFactory
    {
        public static IUserAuthenticator CreateUserAuthenticator()
            => new UserAuthenticator();
    }
}