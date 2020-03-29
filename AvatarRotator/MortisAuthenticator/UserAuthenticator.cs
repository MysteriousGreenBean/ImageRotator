using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace MortisAuthenticator
{
    internal class UserAuthenticator : IUserAuthenticator
    {
        private const string ConnectionString = "server=mortis.org.pl;database=mortisor_mybb;uid=morti_mws;password=Justin2bieber.pl;charset=utf8";

        public async Task<(int ID, string username)> GetUserIfValidCredentialsAsync(string username, string password)
        {
            User user = await this.GetUserByUserName(username);

            if (user == null)
                return (ID: -1, username: string.Empty);

            if (this.IsPasswordValid(password, user))
                return (ID: user.uid, username: user.username);
            return (ID: -1, username: string.Empty);
        }

        public async Task<bool> DoesUserExistAsync(int id)
        {
            using (var connection = new MySqlConnection(UserAuthenticator.ConnectionString))
                return await connection.QueryFirstAsync<int>("SELECT COUNT(*) FROM mybb_users WHERE uid = @uid",
                           new {uid = id}) == 1;
        }

        private async Task<User> GetUserByUserName(string username)
        {
            using (var connection = new MySqlConnection(UserAuthenticator.ConnectionString))
                return await connection.QueryFirstAsync<User>(
                    "SELECT uid, username, password, salt FROM mybb_users WHERE username = @name",
                    new {name = username});
        }

        private bool IsPasswordValid(string password, User user)
            => this.HashWithMD5(this.HashWithMD5(user.salt) + this.HashWithMD5(password)) == user.password;

        private string HashWithMD5(string stringToHash)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] lvAsciiBytes = System.Text.Encoding.ASCII.GetBytes(stringToHash);
                byte[] lvHashedBytes = md5.ComputeHash(lvAsciiBytes);
                string lvHashedString = BitConverter.ToString(lvHashedBytes).Replace("-", "").ToLower();

                return lvHashedString;
            }
        }
    }
}
