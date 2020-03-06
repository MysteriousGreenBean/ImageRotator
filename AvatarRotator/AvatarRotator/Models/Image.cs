using System;

namespace AvatarRotator.Models
{
    public class Image
    {
        public int ID { get; set; }
        public int RotationID { get; set; }
        public string Link { get; set; }
        public DateTime Added { get; set; }
    }
}
