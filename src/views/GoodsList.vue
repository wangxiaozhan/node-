<template>
  <div>

    <nav-header></nav-header>
    <nav-bread >
      <!--通过slot名字配排到对应的插槽-->
      <span slot="Goods">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods();">Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
              <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}}--{{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4 list-wrap">
              <ul>
                <li class="item" v-for="item in goodsList"><!--遍历商品列表-->
                  <div class="pic">
                    <a href="#"><img v-bind:src="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn-cart" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="/static/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<footer class="footer">
      <div class="footer__wrap">
        <div class="footer__secondary">
          <div class="footer__inner">
            <div class="footer__region">
              <span>Region</span>
              <select class="footer__region__select">
                <option value="en-US">USA</option>
                <option value="zh-CN">China</option>
                <option value="in">India</option>
              </select>
            </div>
            <div class="footer__secondary__nav">
              <span>Copyright © 2017 IMooc All Rights Reserved.</span>
              <a href="http://us.lemall.com/us/aboutUs.html">
                About Us
              </a>
              <a href="http://us.lemall.com/us/termsofUse.html">
                Terms &amp; Conditions
              </a>
              <a href="http://us.lemall.com/us/privacyPolicy.html">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>-->
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal()">
      <p slot="message">
        请先登录，否则无法加入购物车中！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false" href="javascript:;">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal()">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart=false" href="javascript:;">继续购物</a>
        <router-link to="/cart" href="javascript:;" class="btn btn--m">
          查看购物车
        </router-link>
      </div>


    </modal>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
    import '../assets/css/base.css'
    import '../assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    export default{
        data() {
          return{
            goodsList:[],
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,/*默认设置加载图片是禁用的*/
            loading:false,
            mdShow:false,
            mdShowCart:false,
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'100.00'
              }, {
                startPrice:'100.00',
                endPrice:'500.00'
              },{
              startPrice:'500.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'5000.00'
              }
            ],
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false,
          }
        },
        mounted(){
          this.getGoodsList();
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
          getGoodsList(flag) {
            var param={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked,
            }
            this.loading=true;//在接口请求之前，需要一下秀loading
            axios.get("/goods/list",{
              params:param,
            }).then((response) => {
              let res = response.data;
              this.loading=false;
              if (res.status == '0') {
                if(flag){
                  this.goodsList = this.goodsList.concat(res.result.list);//将从后端获取的数据付给商品列表
                              if(res.result.count==0){
                                this.busy=true;
                              }else{
                                this.busy=false;
                              }
                }else{
                  this.goodsList=res.result.list;
                  this.busy=false;
                }
              } else {
                this.goodsList = [];
              }
            })
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.getGoodsList();
          },
              showFilterPop()
          {
            this.filterBy=true;
              this.overLayFlag=true;
          },
          setPriceFilter(index){
            this.priceChecked=index;
            this.page=1;
            this.getGoodsList();
            this.closePop();
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
          },
          loadMore(){
            this.busy=true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);
          },
          addCart(productId){
            axios.post("/goods/addCart",{
              productId:productId
            }).then((response)=>{
              let res=response.data;
              if(res.status=='0'){
                  this.mdShowCart=true;
              }else{
                this.mdShow=true;
              }
            });
          },
          closeModal(){
            this.mdShow=false;
            this.mdShowCart=false;
          }

        }

    }
</script>
<style scoped="scoped">
  .list-wrap ul::after{
  clear:both;
    content: '';
    height:0;
    display: block;
    visibility: hidden;
  }
  .load-more{
    height: 100px;
    width:100px;
    position: relative;
    text-align: center;
    margin:0 auto;
  }
  .btn:hover{
    background-color: #ffe5e6;
    transition: all .3s ease-out;
  }
  .sort-up{
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
</style>
