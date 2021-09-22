package com.example.demo.service;

import com.example.demo.dao.RoleDao;
import com.example.demo.dao.UserDao;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    private final RoleDao roleDao;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl( UserDao userDao, RoleDao roleDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    @Override
    public User save(User user, boolean encodePassword) {
        if (user.getRoles() == null || user.getRoles().size() == 0) {
            List<Role> roles = new ArrayList<>();
            roles.add(roleDao.findByRoleName("ROLE_USER"));
            user.setRoles(roles);
        }

        if (encodePassword) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        userDao.save(user);
        return user;
    }
    @Transactional
    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }
    @Transactional
    @Override
    public User findByUsername(String username) {
        return userDao.getUserByFirstNam(username);
    }
    @Transactional
    @Override
    public void delete(Long id) {
        userDao.deleteById(id);
    }
    @Transactional
    @Override
    public User getUser(Long id) {
        return userDao.getById(id);
    }

    @Override
    public User update(User user) {
        return userDao.save(user);
    }
}
