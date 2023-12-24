// const redis = require('redis');
// const host = 'redis-10656.c252.ap-southeast-1-1.ec2.cloud.redislabs.com'; // Thay YOUR_REDIS_HOST bằng địa chỉ host của Redis server
// const port = 10656; // Thay YOUR_REDIS_PORT bằng cổng của Redis server
// const password = 'YyRAhniRFBzK12CyXWE9fBj9w25rEt4H'; // Thay YOUR_REDIS_PASSWORD bằng mật khẩu của Redis server
// const database = "ManhCuong-free-db"
// const redisClient = redis.createClient();
// // Kiểm tra kết nối Redis
// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// // Kiểm tra lỗi kết nối Redis
// redisClient.on('error', (err) => {
//   console.error('Error connecting to Redis:', err);
// });


// const arr = [
//   {
//     size: "M",
//     inventory: 100
//   },
//   {
//     size: "L",
//     inventory: 100
//   },
//   {
//     size: "S",
//     inventory: 100
//   }
// ]
// 1. Random ngẫu nhiên 1 range các số tự nhiên.Ví dụ 100 -> 200 và return về list chứa tất cả các số tự nhiên đó
// 2. Dùng lại range các số tự nhiên đã random ở bài 1(từ 100 -> 200).
// Hãy viết code để mỗi lần thực thi, sẽ có 10 số ngẫu nhiên trong range dc generate ra và lưu lại.Mỗi 1 lần chạy đều như vậy và 10 số được generate không được phép trùng nhau.chạy cho đến khi hết range thì dừng và báo lỗi

//   - Ví dụ:
// - Lần 1: output sẽ là[100, 176, 199, 102, 113, 123, 166, 188, 133, 199]let
//   - Lần 2: output sẽ là 10 trong range 100 - 200 và không được trùng với lần 1
//     - ... cho tới khi nào đã lấy ra hết các số trong range thì báo lỗi

function randomRange (min, max) {
  let arr = []
  for(let i = min; i<= max; i++) {
    arr.push(i)
  }
}

 let numbers = randomRange(100,200)

 function selectionNumber (array) {
  let result = [];
  for (let index = 0; index < 10; index++) {
    let randomIndex = Math.floor(Math.random() *  array.length)
    result.push(array[randomIndex])
    array.splice(randomIndex, 1)
  }
  return result
 }

 let randomNumbers = selectionNumber(numbers)
 console.log(randomNumbers);

 select 
 


