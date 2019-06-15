### 命名原则

1. 私有属性放在private字段下面，私有方法统一前加下划线，系统属性统一前加双下划线

2. 布尔值（提问式）：has + n（附属） / had + v（原型） / is + adj(状态)

3. 对应：listen / on / handle, 

4. 从属：parent_child

5. 顺序：v + 属性 => 方法

6. 专有：set get toggle

7. 类型：根据名称可以自然判断变量的类型：布尔（确定真假）、数值（可计量值：count, total, amount, ...）、字符串(后缀：code, name, title, ... )、对象（多数情形）、数组(复数）、正则（后缀：reg)、函数（方式 + 目标）、时间(time)