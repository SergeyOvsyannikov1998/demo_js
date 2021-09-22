package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserDao extends JpaRepository<User, Long> {
    @Query(value = "select distinct user from User user join fetch user.roles roles where user.username=:name")
    User getUserByFirstNam(@Param("name") String name);
}
