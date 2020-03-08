using System;
using System.Text;

namespace AvatarRotator.Models
{
    public class Rotation
    {
        public int ID { get; set; }
        public int OwnerID { get; set; }
        public string Name { get; set; }
        public DateTime Added { get; set; }
        public DateTime Modified { get; set; }
        public string Link { get; set; }
    }
}