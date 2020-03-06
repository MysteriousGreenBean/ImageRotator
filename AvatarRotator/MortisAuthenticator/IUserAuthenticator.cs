using System.Threading.Tasks;

namespace MortisAuthenticator
{
    public interface IUserAuthenticator
    {
        /// <summary>
        /// Checks if provided username and password are valid.
        /// </summary>
        /// <param name="username">Username of user to validate.</param>
        /// <param name="password">User password.</param>
        /// <returns>ID of an authenticated user, -1 otherwise.</returns>
        Task<(int ID, string username)> GetUserIfValidCredentialsAsync(string username, string password);

        /// <summary>
        /// Checks if user with given ID exists.
        /// </summary>
        /// <param name="id">ID of a user to check.</param>
        /// <returns>True if user exists, false otherwise.</returns>
        Task<bool> DoesUserExistAsync(int id);
    }
}